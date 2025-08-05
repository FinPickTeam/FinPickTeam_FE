const fs = require("fs");
const path = require("path");

// Transaction_dummy.json 파일 경로
const transactionFilePath = path.join(
  __dirname,
  "src",
  "pages",
  "openbanking",
  "Transaction_dummy.json"
);

// 거래 데이터 업데이트 함수
function updateTransactionCategory(transactionId, newCategory) {
  try {
    // 파일 읽기
    const fileContent = fs.readFileSync(transactionFilePath, "utf8");
    const data = JSON.parse(fileContent);

    // 해당 거래의 description 업데이트
    if (data.transactions[transactionId]) {
      const oldCategory = data.transactions[transactionId].description;
      data.transactions[transactionId].description = newCategory;

      // 파일에 다시 쓰기
      fs.writeFileSync(
        transactionFilePath,
        JSON.stringify(data, null, 2),
        "utf8"
      );

      console.log(
        `거래 ${transactionId}의 카테고리가 "${oldCategory}"에서 "${newCategory}"로 변경되었습니다.`
      );
      return true;
    } else {
      console.error(`거래 ID ${transactionId}를 찾을 수 없습니다.`);
      return false;
    }
  } catch (error) {
    console.error("파일 업데이트 중 오류 발생:", error);
    return false;
  }
}

// 명령행 인수 처리
if (process.argv.length >= 4) {
  const transactionId = parseInt(process.argv[2]);
  const newCategory = process.argv[3];

  if (isNaN(transactionId)) {
    console.error("올바른 거래 ID를 입력해주세요.");
    process.exit(1);
  }

  updateTransactionCategory(transactionId, newCategory);
} else {
  console.log("사용법: node update-transaction.js <거래ID> <새카테고리>");
  console.log('예시: node update-transaction.js 0 "카페"');
}

module.exports = { updateTransactionCategory };
