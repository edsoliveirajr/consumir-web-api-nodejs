const express = require("express")
const request = require("request")
const crypto = require("crypto");
const formData = require("form-data");

const server = express();

server.use(express.json());

var objetoJson = null;

function Middleware(req, res, next){
    if (objetoJson == null)
    {
        return res.status(401).json({"error": "Não foi encontrado o objeto. Favor chamar a api GetObject primeiro."});
    }

    next();
}

server.get("/Get", (req, res) => {
        request("https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=03bc8c590030d7bf4bf671c665af2af9532721cf", 
        (error, response, body)=> {
            objetoJson = JSON.parse(body);
    });

    return res.json({"msg": "Api consumida com sucesso."});
});

server.get("/Show", (req, res) => {
    return res.json(objetoJson);
});

server.get("/Decrypt", Middleware, (req, res) => {

    let array = []
    let str = objetoJson.cifrado;

    for (var i = 0; i < str.length; i++) { 
        let ind = str.charAt(i).charCodeAt() 
        let letter; 
    
        if ((ind >= 97) && (ind <= 122))  
        {
            ind = ind - objetoJson.numero_casas

            letter = ind < 97 ? ind + 26 : ind 
        }	
        else
        {
            letter = ind
        }
    
        array.push(letter)
    }
    
    objetoJson.decifrado =  String.fromCharCode(...array)

    return res.json(objetoJson);
});

function sha1(data) {
    return crypto.createHash("sha1").update(data, "binary").digest("hex");
}

server.get("/ResumeEncrypted", Middleware, (req, res) => {    

    objetoJson.resumo_criptografico = sha1(objetoJson.decifrado);
    return res.json(objetoJson);
});

/*
server.get("/PostApi", (req, res)=> {
    const options = {
        method: "POST",
        url: "https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=ea15a4bd631e2b97f372f48aa4c6519021bff503",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        form : {
            "type": "file",
            "file" : fs.readFileSync("./temp/answer.file")
        }
    };
})
*/
server.listen("3333");
