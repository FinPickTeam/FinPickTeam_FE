// src/utils/pdfDownload.js
// 필요: npm i html2canvas jspdf
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 문자열 '10mm' -> 숫자 mm, 숫자면 그대로
const mm = (v) => (typeof v === 'number' ? v : parseFloat(v) || 0);

/**
 * 단일 캔버스로 전체 요소 캡쳐 후, 타일링해서 여러 페이지로 저장 (빠르고 일반적)
 */
async function singleCanvasToPDF({
  element,
  filename = 'report.pdf',
  format = 'a4', // jsPDF 포맷
  marginMm = 10, // mm
  scale = Math.min(2, window.devicePixelRatio || 1),
  imageType = 'JPEG', // 'JPEG' | 'PNG'
  imageQuality = 0.92, // 0 ~ 1
}) {
  const el =
    typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) throw new Error('singleCanvasToPDF: element not found');

  const canvas = await html2canvas(el, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: el.scrollWidth,
    height: el.scrollHeight,
  });

  const pdf = new jsPDF('p', 'mm', format);
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();
  const margin = mm(marginMm);
  const contentW = pdfW - margin * 2;
  const contentH = pdfH - margin * 2;

  // 1페이지에 들어갈 원본(px) 높이
  const pageHeightPx = Math.floor((contentH * canvas.width) / contentW);

  const tmp = document.createElement('canvas');
  const tctx = tmp.getContext('2d', { willReadFrequently: true });
  tmp.width = canvas.width;

  let y = 0;
  let page = 0;
  while (y < canvas.height) {
    const sliceH = Math.min(pageHeightPx, canvas.height - y);
    tmp.height = sliceH;

    tctx.clearRect(0, 0, tmp.width, tmp.height);
    tctx.drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, tmp.width, sliceH);

    const img = tmp.toDataURL(`image/${imageType.toLowerCase()}`, imageQuality);
    const imgH_mm = (sliceH * contentW) / canvas.width; // mm

    if (page > 0) pdf.addPage();
    pdf.addImage(img, imageType, margin, margin, contentW, imgH_mm);

    y += sliceH;
    page += 1;
  }

  pdf.save(filename);
}

/**
 * 초초장문/브라우저 캔버스 한계 대비: 요소를 y축 조각(slice)별로 **여러 번 캡쳐**해서 PDF에 이어붙임
 * 느리지만 확실함. slicePx는 2048~4096 권장.
 */
async function chunkedCaptureToPDF({
  element,
  filename = 'report.pdf',
  format = 'a4',
  marginMm = 10,
  scale = Math.min(2, window.devicePixelRatio || 1),
  imageType = 'JPEG',
  imageQuality = 0.92,
  slicePx = 4096,
}) {
  const el =
    typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) throw new Error('chunkedCaptureToPDF: element not found');

  const totalHeight = el.scrollHeight;
  const totalWidth = el.scrollWidth;

  // 요소의 문서 기준 top 좌표
  const rect = el.getBoundingClientRect();
  const scrollTop =
    window.pageYOffset || document.documentElement.scrollTop || 0;
  const elementTop = rect.top + scrollTop;

  const pdf = new jsPDF('p', 'mm', format);
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();
  const margin = mm(marginMm);
  const contentW = pdfW - margin * 2;
  const contentH = pdfH - margin * 2;

  // 캔버스(px) -> PDF(mm) 변환 비율(폭 기준)
  const pxPerMm = totalWidth / contentW;
  const pageHeightPx = Math.floor(contentH * pxPerMm);

  let y = 0;
  let page = 0;

  // 타일링용 임시 캔버스(매 반복 재사용)
  const tmp = document.createElement('canvas');
  const tctx = tmp.getContext('2d', { willReadFrequently: true });

  while (y < totalHeight) {
    const currentSlicePx = Math.min(slicePx, totalHeight - y);

    // 요소의 y 오프셋 위치를 뷰포트로 맞춰 캡쳐
    const sliceCanvas = await html2canvas(el, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: totalWidth,
      height: currentSlicePx,
      scrollX: 0,
      scrollY: -(elementTop + y), // 문서 스크롤을 음수로 보정해서 y 오프셋 맞춤
      windowWidth: Math.max(totalWidth, document.documentElement.clientWidth),
      windowHeight: currentSlicePx,
    });

    // 한 조각도 페이지보다 길 수 있으니 또 타일링
    let innerY = 0;
    tmp.width = sliceCanvas.width;

    while (innerY < sliceCanvas.height) {
      const take = Math.min(pageHeightPx, sliceCanvas.height - innerY);
      tmp.height = take;

      tctx.clearRect(0, 0, tmp.width, tmp.height);
      tctx.drawImage(
        sliceCanvas,
        0,
        innerY,
        sliceCanvas.width,
        take,
        0,
        0,
        tmp.width,
        take
      );

      const img = tmp.toDataURL(
        `image/${imageType.toLowerCase()}`,
        imageQuality
      );
      const imgH_mm = (take * contentW) / sliceCanvas.width;

      if (page > 0) pdf.addPage();
      pdf.addImage(img, imageType, margin, margin, contentW, imgH_mm);
      page += 1;
      innerY += take;
    }

    y += currentSlicePx;
  }

  pdf.save(filename);
}

/**
 * 공개 API: 긴 요소를 자동으로 멀티페이지 PDF로 다운로드
 *  - mode: 'auto' | 'single' | 'chunked'
 *  - auto: 높이 보고 single 시도, 너무 길면 chunked
 */
export async function downloadElementAsPDF({
  element, // DOM 노드 or 셀렉터 문자열
  filename = 'report.pdf',
  format = 'a4',
  marginMm = 10,
  scale = Math.min(2, window.devicePixelRatio || 1),
  imageType = 'JPEG',
  imageQuality = 0.92,
  slicePx = 4096,
  mode = 'auto',
} = {}) {
  const el =
    typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) throw new Error('downloadElementAsPDF: element not found');

  const doSingle = () =>
    singleCanvasToPDF({
      element: el,
      filename,
      format,
      marginMm,
      scale,
      imageType,
      imageQuality,
    });

  const doChunked = () =>
    chunkedCaptureToPDF({
      element: el,
      filename,
      format,
      marginMm,
      scale,
      imageType,
      imageQuality,
      slicePx,
    });

  if (mode === 'single') return doSingle();
  if (mode === 'chunked') return doChunked();

  // auto: 너무 길면 chunked, 아니면 single 시도 후 실패 시 chunked
  const tooTallPx = 20000; // 프로젝트에 맞게 조절 가능
  const totalHeight = el.scrollHeight;

  if (totalHeight > tooTallPx) {
    return doChunked();
  }
  try {
    await doSingle();
  } catch {
    return doChunked();
  }
}

export default { downloadElementAsPDF };
