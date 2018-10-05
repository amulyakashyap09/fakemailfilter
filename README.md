# Fake Mail Filter ![CI status](https://img.shields.io/badge/build-passing-brightgreen.svg)

FakeEmailFilter is a Nodejs library checks that particular email exists or not before sending the email.

## Installation

### Requirements
* Linux/Windows/Mac
* Node > 7.4.x

`$ npm install fakemailfilter --save`

## Usage

```javascript
"use strict";

const fmf = require("./fakeEmailFinder")

const start = async ()=>{
    let fromEmail = "amulyakashyap09@gmail.com";
    let toEmail = "amulya.ratan@bookmyshow.com";
    let result = await fmf.checkIfEmailIsValid(fromEmail, toEmail)
    console.log("Result : ", result)    
}

start();
```

## Sample Output
```json
$ This email does not exists

{
    "email": "amulyadoesnotexistsinemail@gmail.com", 
    "status": false, 
    "error": e
}

$ This email does not exists

{
    "email": "amulyakashyap09@gmail.com", 
    "status": true, 
    "error": null
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)