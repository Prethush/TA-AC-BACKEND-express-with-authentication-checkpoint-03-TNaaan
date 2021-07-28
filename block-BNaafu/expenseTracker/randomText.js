function randomNumber() {
     let str = "0123456789", str2 = "";
    for(let i = 0; i <= 5; i++) {
     str2 += str[Math.floor(Math.random() * 8)];
  }
 return str2;
}

module.exports = randomNumber;