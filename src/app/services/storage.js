import { db } from "../config/config";

export const USUARIO_LOGADO_KEY = "usuarioLogado";
export const UNIDADE_LOGADA_KEY = "unidadeLogada";
export const REDES_KEY = "redes";
export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const CONVENIOS_KEY = "convenios";

const keys = [USUARIO_LOGADO_KEY, REDES_KEY, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, CONVENIOS_KEY, UNIDADE_LOGADA_KEY];

export const getAuthLocal = function() {
  const accessToken = JSON.parse(localStorage[`_immortal|${ACCESS_TOKEN_KEY}`] || null);
  const refreshToken = JSON.parse(localStorage[`_immortal|${REFRESH_TOKEN_KEY}`] || null);
  const usuarioLogado = JSON.parse(localStorage[`_immortal|${USUARIO_LOGADO_KEY}`] || null);
  
  return {
    accessToken,
    refreshToken,
    usuarioLogado
  };
}

const get = async function(key) {
  if (!keys.includes(key)) {
    throw Error(
      `A "key" ${key} não foi configurada em src/services/storage.js`
    );
  }
  
  const value = await db.get(key);

  if(!value) {
      return null;
  }
  
  return JSON.parse(value);
};

const set = async function(key, value) {
  if (!keys.includes(key)) {
    throw Error(
      `A "key" ${key} não foi configurada em src/services/storage.js`
    );
  }

  return db.set(key, JSON.stringify(value));
};

const removeAll = async function() {
  return Promise.all(keys.map(key => db.remove(key)));
};

const localStorageService = {
  get,
  set,
  removeAll,
};

export default localStorageService;
