const path = require('path');

module.exports = {
    entry: './dist/lwwRegister.js', // 입력 파일 (프로젝트에 맞게 수정)
    output: {
        filename: 'bundle.js', // 번들된 JavaScript 파일 이름
        path: path.resolve(__dirname, 'dist') // 번들된 파일을 저장할 디렉토리
    },
};
