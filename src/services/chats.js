export const TOKEN_KEY = "@vendergas-chats";

export const getChats = () => localStorage.getItem(TOKEN_KEY);

export const haveChats = () => localStorage.getItem(TOKEN_KEY) !== null;

export const addChat = chat => {
  const get = localStorage.getItem(TOKEN_KEY);
  
  if(!get) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify([chat]));
  } else {
    const exists = JSON.parse(get).includes(chat);
    if (!exists) {
      const newNumber = JSON.parse(get).concat(chat);
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newNumber));
    }
  }
};

export const removeChat = chat => {
  const get = localStorage.getItem(TOKEN_KEY);

  if(get){
    const chats = JSON.parse(get);
    if(chats.includes(chat)){
      const index = chats.indexOf(chat);
      chats.splice(index, 1);
      localStorage.setItem(TOKEN_KEY, JSON.stringify(chats));
    }
  }
}