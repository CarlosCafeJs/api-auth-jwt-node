// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUserToken = async (req, res) => {
  const id = req.params.id

  //checando se usuario existe

  const user = await User.findById(id, "-password")

  if(!user){
    return res.status(404).json({msg: 'Opa, não encontramos este usuario'})
  }
   
  res.status(200).json({ user })

}

function checkToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]
  if(!token){
    return res.status(401).json({msg: "Eita, seu acesso foi negado, tente logar de novo!"})
  }

  try{
    const secret = process.env.SECRET

    jwt.verify(token, secret)

    next()

  }catch(error){
    return res.status(400).json({msg: `Cara, seu token ta invalido!`})
  }
}



// Função de registro de usuário
const registerUser = async (req, res) => {
  // Lógica de registro de usuário

    const {name, email, password, confirmpassword} = req.body
  
    //validação
    if(!name){
      return res.status(422).json({msg: `O campo 'NOME' não pode estar vazio!`})
    }
  
    if(!email){
      return res.status(422).json({msg: `O campo 'E-MAIL' não pode estar vazio!`})
    }
  
    if(!password){
      return res.status(422).json({msg: `O campo 'SENHA' não pode estar vazio!`})
    }
  
    if(password != confirmpassword){
      return res.status(422).json({msg: `As senhas não conferem`})
  
    }
  
    // CHECANDO SE O USUARIO EXISTE
  
    const userExist = await User.findOne({email: email})

    if(userExist){
      return res.status(422).json({msg: `Já é de casa, seu email ja existe, tente logar`})
    }
  
    //gerando password
    const salt = await bcrypt.genSalt(13)
    const passwordHash = await bcrypt.hash(password, salt)
  
    //criando o usuario 
  
    const user = new User({
      name,
      email,
      password: passwordHash
    })
  
    try{
      await user.save()
      res.status(201).json({msg:'Ei, que incrivel seu usuario foi criado com sucesso!'})
    }catch(error){
      res.status(500).json({msg:'Eita, algo de errado com servidor, tenta novamente mais tarde, ok?'})
    }

};

// Função de autenticação de usuário
const loginUser = async (req, res) => {
//AUTENTICAR USUARIO
  const {email, password} = req.body

  if(!email){
    return res.status(422).json({msg: `O campo 'E-MAIL' não pode estar vazio!`})
  }

  if(!password){
    return res.status(422).json({msg: `O campo 'SENHA' não pode estar vazio!`})
  }
// CHECANDO SE USUARIO EXISTE

const user = await User.findOne({email: email})
if(!user){
  return res.status(404).json({msg: `Eita, parece que o usuario não existe, tente criar um novo.`})
}

//VERIFICANDO SENHA
const checkPassword = await bcrypt.compare(password, user.password)
if(!checkPassword){
  return res.status(422).json({msg: 'Poxa, a senha não esta correta, tente novamente ou redefina'})
}
try{

  const secret = process.env.SECRET
  const token = jwt.sign({
    id: user._id
  },
  secret,)

  res.status(200).json({msg:'UAU! Voce logou!', token})
}catch(error){
  console.log(error)
  res.status(500).json({msg:'Eita, algo de errado com servidor, tenta novamente mais tarde, ok?'})
}



};

module.exports = { registerUser, loginUser, registerUserToken, checkToken };
