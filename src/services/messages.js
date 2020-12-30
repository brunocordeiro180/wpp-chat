export const TOKEN_KEY = "@vendergas-messages";

export const getStorageMessages = () => localStorage.getItem(TOKEN_KEY);

export const haveStorageMessages = () => localStorage.getItem(TOKEN_KEY) !== null;

export const setStorageMessage = message => {
  const get = localStorage.getItem(TOKEN_KEY);
  
  if(!get) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify([message]));
  } else {
    const exists = JSON.parse(get).includes(message);
    if (!exists) {
      const newNumber = JSON.parse(get).concat(message);
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newNumber));
    }
  }
};

export const removeMessages = client => {
  const get = localStorage.getItem(TOKEN_KEY);

  if(get){
    const messages = JSON.parse(get);
    const messagesFiltered = messages.filter((message) => {return (message.from != client && message.to != client)});
    
    localStorage.setItem(TOKEN_KEY, JSON.stringify(messagesFiltered));
  }
}