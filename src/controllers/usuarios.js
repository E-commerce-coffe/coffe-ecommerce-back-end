const { PrismaClient }= require('@prisma/client') 
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
// Encriptar contraseña
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    const allUsers = await prisma.personas.findMany()
    res.json(allUsers);
  } catch (error) {
    res.status(500);
    res.send('Personas no econtrados/error');
  }
};

const postCreateUser = async (req, res) => {
  try {
    console.log(req.body);
    const { nombre_usuario, apellido_usuario, documento_usuario,correo_usuario, tipo_documento, contrasena_usuario, tipo_usuario } = req.body;
    if (!nombre_usuario || !apellido_usuario || !documento_usuario || !correo_usuario || !tipo_documento||!contrasena_usuario ||!tipo_usuario) {
      res.status(400).send('Los parámetros requeridos no están presentes');
      return;
    }
    console.log('entre ');
    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.personas.findFirst({
      where: {
        correo_usuario: correo_usuario,
      },
    });

    if (usuarioExistente) {
      res.status(400).json({ error: 'Ya existe un usuario con este correo electrónico' });
      return;
    }
    console.log('entre y no existe');
    // Crear el usuario
    const user = await prisma.personas.create({
      data: {
        nombre_usuario,
        apellido_usuario,
        documento_usuario,
        correo_usuario,
        tipo_documento,
        tipo_usuario,
      }
    });
    const saltRounds = 10;
    bcrypt.hash(contrasena_usuario, saltRounds, async function (err, hash) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Usuario no creado' });
        return;
      }
      console.log(hash);
      // Crear las credenciales con la contraseña encriptada
      const creden = await prisma.credenciales.create({
        data: {
          nombre_usuario: correo_usuario,
          contrasena_usuario: hash
        },
      });
      // Devolver una respuesta JSON con el usuario creado
      res.status(201).json({
        message: 'Usuario creado correctamente',
      });
    } ); 
  }
  
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Usuario no creado' });
  }
};

/**generea metodo para verificar la sesion con la tabla credenciales y genera un jwt */
const postLogin = async (req, res) => {
  console.log(req.body);
  const secretKey = process.env.SECRET_SEND;
  try {
    const usuarioCript = req.body.usuario;
    const contrasenaCript = req.body.contrasena;
    const usuarioBytes = CryptoJS.AES.decrypt(usuarioCript, secretKey);
    const contrasenaBytes = CryptoJS.AES.decrypt(contrasenaCript, secretKey);

    const usuarioDesencriptado = usuarioBytes.toString(CryptoJS.enc.Utf8);
    const contrasenaDesencriptada = contrasenaBytes.toString(CryptoJS.enc.Utf8);

    console.log('Usuario desencriptado:', usuarioDesencriptado);
    console.log('Contraseña desencriptada:', contrasenaDesencriptada);
    usuario = usuarioDesencriptado;
    contrasena= contrasenaDesencriptada;
    if (!(usuario && contrasena)) {
      return res.status(400).send("Los parámetros requeridos no están presentes");
    }
    const person = await prisma.credenciales.findUnique({ where: { nombre_usuario: usuario } });
    
    if (!person) {
      return res.status(400).send("Usuario no encontrado");
    }
    console.log('entro login ');
    const user= await prisma.personas.findUnique({where:{correo_usuario:usuario}});
    if (await validatePassword(contrasena, usuario)) {
      console.log('contraseña correcta');
      //generar token se sesion 
      const token = jwt.sign({ id: user.id_persona, nombre: user.nombre_usuario,apellido:user.apellido_usuario,tipo_usuario:user.tipo_usuario}, process.env.JWT_SECRET, {
        expiresIn: '60s',
      });
      return res.json({ token: token, message: 'Inicio de sesión correcto' });
    } else {
      return res.status(400).send("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error(error);
    return next(error); // Pasa el control al middleware de manejo de errores
  }
};
/**valida contrasena ingresada con el hash */
const validatePassword = async (password,usuario) => {
  const person= await prisma.credenciales.findUnique({ where: { nombre_usuario: usuario } });
  return await bcrypt.compare(password, person.contrasena_usuario);
};

const putForgotPassword =async(req,res)=>{
  const { username, } = req.body;
  if(!username){
    return res.status(400).send('Los parámetros requeridos no están presentes');
  }
  const message= 'Revisa tu correo electrónico para restablecer tu contraseña';
  let verificationlink;
  let emailstatus="OK";
  try {
    user= await prisma.personas.findUnique({where:{correo_usuario:username}});
    const token = jwt.sign({}, process.env.JWT_SECRET,{expiresIn:'10m'});
    verificationlink=`http://localhost:3000/users/reset-password/${token}`;
    let resetToken= token;
    console.log(resetToken);
    await prisma.personas.update({
      where: {
        correo_usuario: username
      },
      data: {
        token_password: resetToken
      },
    });
    } catch (error) {
      return res.status(500).json({message:'Error al guardar el token'});      
    }
  //enviar correo electrónico
  // email

  res.json({message,infor:emailstatus,test:verificationlink});

}

const putResetPassword= async(req,res)=>{
  const {newpassword}= req.body;
  const resetToken= req.headers.reset;
  let correoUsuario
  console.log(resetToken);
  if(!newpassword || !resetToken){
    return res.status(400).send('Los parámetros requeridos no están presentes');
  }
  let jwtPayload;
  try {
    const persona = await prisma.personas.findFirst({
      where: {
        token_password: resetToken,
      },
    });
  
    
      correoUsuario = persona.correo_usuario;
      console.log("Correo del usuario:", correoUsuario);
    
    jwtPayload = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch (error) {
    // Manejar errores de verificación del token, por ejemplo, token inválido o expirado
    return res.status(401).json({ message: 'Token inválido',error });
  }

  try {
    bcrypt.hash(newpassword, saltRounds, async function (err, hash) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Usuario no creado' });
        return;
      }
      console.log(hash);
  
      const validateuser = await prisma.personas.update({
        where: {
          token_password: resetToken,
          correo_usuario: correoUsuario
        },
        data: {
          credenciales: {
            update: {
              contrasena_usuario: hash,
            },
          },
          token_password: null, // Limpia el campo resetToken después de cambiar la contraseña
        },
      });
  
      // Resto del código de respuesta aquí...
    });
  } catch (error) {
    return res.status(401).json({message:'no fue posible cambiar la contraseña'});
    
  }

  res.json({message:'contraseña cambiada correctamente'});
}

/**genere el metodod para autenticar el jwt y dar accedo a otras rutas */
const authenticateToken = (req, res, next) => {



  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    if (new Date(user.exp * 1000) < new Date()) {
      console.log('TOKEN EXPIRADO');
      return res.sendStatus(401);
    }
    console.log('TOKEN VIGENTE');
    req.user = user;
    next();
  });
};


module.exports = {
  getUsers,
  postCreateUser,
  postLogin,
  authenticateToken,
  putForgotPassword,
  putResetPassword
}