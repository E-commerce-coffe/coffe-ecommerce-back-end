const { PrismaClient }= require('@prisma/client') 
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');
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

    const { NOMBRE_USUARIO, APELLIDO_USUARIO, DOCUMETO_USUAR, CORREO_USUARIO, TIPO_USUARIO, credenciales } = req.body;
    if (!NOMBRE_USUARIO || !CORREO_USUARIO || !APELLIDO_USUARIO || !credenciales || !DOCUMETO_USUAR) {
      res.status(400).send('Los parámetros requeridos no están presentes');
      return;
    }
    console.log('entre ');
    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.personas.findFirst({
      where: {
        CORREO_USUARIO: CORREO_USUARIO,
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
        NOMBRE_USUARIO,
        APELLIDO_USUARIO,
        DOCUMETO_USUAR,
        CORREO_USUARIO,
        TIPO_USUARIO,
      }
    });
    const saltRounds = 10;
    bcrypt.hash(credenciales.CONTRASENA_USUARIO, saltRounds, async function (err, hash) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Usuario no creado' });
        return;
      }
      console.log(hash);
      // Crear las credenciales con la contraseña encriptada
      const creden = await prisma.credenciales.create({
        data: {
          NOMBRE_USUARIO: CORREO_USUARIO,
          CONTRASENA_USUARIO: hash
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
  try {
    const { usuario, contrasena } = req.body;
    if (!(usuario && contrasena)) {
      return res.status(400).send("Los parámetros requeridos no están presentes");
    }
    const person = await prisma.credenciales.findUnique({ where: { NOMBRE_USUARIO: usuario } });
    
    if (!person) {
      return res.status(400).send("Usuario no encontrado");
    }
    console.log('entro login ');

    if (await validatePassword(contrasena, usuario)) {
      console.log('contraseña correcta');
      const token = jwt.sign({}, process.env.JWT_SECRET, {
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
  const person= await prisma.credenciales.findUnique({ where: { NOMBRE_USUARIO: usuario } });
  return await bcrypt.compare(password, person.CONTRASENA_USUARIO);
};

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
  authenticateToken
}