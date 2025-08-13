// src/stores/favorite.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import {
  getWishlistProductId, // GET /v1/wishlist/{productType}/names
  addWishlist, // POST /v1/wishlist
  deleteWishlist, // DELETE /v1/wishlist ({data: dto})
} from '@/api';

const TYPE = Object.freeze({
  DEPOSIT: 'DEPOSIT',
  INSTALLMENT: 'INSTALLMENT',
  STOCK: 'STOCK',
  FUND: 'FUND',
});

function toUpperType(t) {
  if (!t) return '';
  const up = String(t).toUpperCase();
  return TYPE[up] || up; // 안전하게 대문자화
}

export const useFavoriteStore = defineStore('favorite', () => {
  // 타입별 ID 집합: 화면에서 isFavorite 판정 용도
  const idSets = ref({
    [TYPE.DEPOSIT]: new Set(), // 예: "35", "42" ...
    [TYPE.INSTALLMENT]: new Set(),
    [TYPE.STOCK]: new Set(), // 예: 종목코드 "005930"
    [TYPE.FUND]: new Set(),
  });

  // idSets가 손상되었을 때 복구하는 함수
  function ensureIdSetsIntegrity() {
    if (!idSets.value || typeof idSets.value !== 'object') {
      idSets.value = {
        [TYPE.DEPOSIT]: new Set(),
        [TYPE.INSTALLMENT]: new Set(),
        [TYPE.STOCK]: new Set(),
        [TYPE.FUND]: new Set(),
      };
      return true; // 복구됨
    }
    return false; // 정상
  }

  // 중복 클릭 방지
  const busy = ref(new Set());

  // --- 프론트 상품 객체 -> 서버 DTO 매핑 (userId 포함) ---
  function toDto(product, userId) {
    // 예금  (id 또는 depositProductId 허용)
    if (
      product.depositProductId ||
      (product.id != null && product.depositProductName)
    ) {
      const productId = String(product.depositProductId ?? product.id);
      return { productType: TYPE.DEPOSIT, productId, userId };
    }

    // 적금
    if (
      product.installmentProductId ||
      (product.id != null && product.installmentProductName)
    ) {
      const productId = String(product.installmentProductId ?? product.id);
      return { productType: TYPE.INSTALLMENT, productId, userId };
    }

    // 주식  (stockCode 또는 stockName)
    if (product.stockCode || product.stockName) {
      let productId;
      if (product.stockCode) {
        // stockCode를 6자리 종목코드로 변환 (앞에 0 추가)
        const stockCodeStr = String(product.stockCode);
        if (stockCodeStr.length < 6) {
          // 6자리 미만이면 앞에 0을 추가
          productId = stockCodeStr.padStart(6, '0');
        } else {
          productId = stockCodeStr;
        }
      }
      return { productType: TYPE.STOCK, productId, userId };
    }

    // 펀드  (fundId 또는 id)
    if (
      product.fundId ||
      (product.id != null && (product.fundProductName || product.name))
    ) {
      const productId = String(product.fundId ?? product.id);
      return { productType: TYPE.FUND, productId, userId };
    }

    return null;
  }

  // --- 서버에서 타입별 ID 세트 동기화 ---
  async function syncIdSet(productType) {
    try {
      const type = toUpperType(productType);

      // API 응답 정규화: 배열 or {data: [...]} 모두 지원
      const res = await getWishlistProductId(type);

      const list = Array.isArray(res) ? res : res?.data ?? [];

      // 주식인 경우 6자리 종목코드로 변환
      let processedList;
      if (type === TYPE.STOCK) {
        processedList = list.map((v) => {
          const stockCodeStr = String(v);
          if (stockCodeStr.length < 6) {
            return stockCodeStr.padStart(6, '0');
          }
          return stockCodeStr;
        });
      } else {
        processedList = list.map((v) => String(v));
      }
      idSets.value[type] = new Set(processedList);
    } catch (error) {
      console.error(`Failed to sync ${productType} ID set:`, error);
      console.error(`Error details:`, {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
      // 에러 발생 시 빈 Set으로 초기화
      idSets.value[toUpperType(productType)] = new Set();
    }
  }

  // --- 전 타입 동기화 (페이지/앱 진입 시 1회 호출 추천) ---
  async function syncAllIdSets() {
    // idSets 무결성 확인 및 복구
    ensureIdSetsIntegrity();

    try {
      await Promise.all([
        syncIdSet(TYPE.DEPOSIT),
        syncIdSet(TYPE.INSTALLMENT),
        syncIdSet(TYPE.STOCK),
        syncIdSet(TYPE.FUND),
      ]);
    } catch (error) {
      console.error('syncAllIdSets failed:', error);
      console.log('idSets.value after error:', idSets.value);

      // 에러 발생 시에도 무결성 확인
      ensureIdSetsIntegrity();
    }
  }

  // --- 즐겨찾기 여부 ---
  function isFavorite(product) {
    const dto = toDto(product, undefined);
    if (!dto) return false;

    const set = idSets.value[dto.productType];
    if (!set) return false;

    let key = String(dto.productId).trim();
    if (dto.productType === TYPE.STOCK) {
      // 숫자만 남기고 6자리 패딩으로 고정
      key = key.replace(/\D/g, '').padStart(6, '0');
    }
    const hit = set.has(key);
    return hit;
  }

  // --- 추가: 즉시 반영 + 실패 롤백 ---
  async function addFavorite(product) {
    const auth = useAuthStore();
    const dto = toDto(product, auth.userId);
    if (!dto) return;

    const key = `${dto.productType}:${dto.productId}`;
    if (busy.value.has(key)) return;

    const set = idSets.value[dto.productType];
    if (set?.has(dto.productId)) return; // 이미 있음

    busy.value.add(key);
    set.add(dto.productId); // UI 선반영

    try {
      await addWishlist(dto);
    } catch (e) {
      // 롤백
      set.delete(dto.productId);
      throw e;
    } finally {
      busy.value.delete(key);
    }
  }

  // --- 삭제: 즉시 반영 + 실패 롤백 ---
  async function removeFavorite(product) {
    const auth = useAuthStore();
    const dto = toDto(product, auth.userId);
    if (!dto) return;

    const key = `${dto.productType}:${dto.productId}`;
    if (busy.value.has(key)) return;

    const set = idSets.value[dto.productType];
    const had = set?.has(dto.productId);

    busy.value.add(key);
    if (had) set.delete(dto.productId); // UI 선반영

    try {
      await deleteWishlist(dto);
    } catch (e) {
      // 롤백
      if (had) set.add(dto.productId);
      throw e;
    } finally {
      busy.value.delete(key);
    }
  }

  return {
    // state
    idSets,

    // actions
    syncIdSet,
    syncAllIdSets,
    isFavorite,
    addFavorite,
    removeFavorite,

    // utility functions
    toDto,
    ensureIdSetsIntegrity,
  };
});
