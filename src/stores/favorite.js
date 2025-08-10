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
      const productId = String(product.stockCode ?? product.stockName);
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
    const type = toUpperType(productType);
    // API 응답 정규화: 배열 or {data: [...]} 모두 지원
    const res = await getWishlistProductId(type);
    const list = Array.isArray(res) ? res : res?.data ?? [];
    idSets.value[type] = new Set(list.map((v) => String(v)));
  }

  // --- 전 타입 동기화 (페이지/앱 진입 시 1회 호출 추천) ---
  async function syncAllIdSets() {
    await Promise.all([
      syncIdSet(TYPE.DEPOSIT),
      syncIdSet(TYPE.INSTALLMENT),
      syncIdSet(TYPE.STOCK),
      syncIdSet(TYPE.FUND),
    ]);
  }

  // --- 즐겨찾기 여부 ---
  function isFavorite(product) {
    const dto = toDto(product, undefined);
    if (!dto) return false;
    const set = idSets.value[dto.productType];
    return set?.has(String(dto.productId)) ?? false;
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
  };
});
