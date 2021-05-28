export const welcomeHeader = (): string => {
  return `Welcome to MoneyBizz `;
};

export const welcomeBody = (code: number, firstName: string): string => {
  return `<h2>Hi ${firstName} &#128075;</h2> 
    <p>We are pleased to welcome you on board as we take upon our world for the greater good.<br>
    <br>
    Your unique code is <b>${code}</b>
    <br> Thank you once again!</p> 
    <br><br>
    <b>All the best!</b>
    <br><br>
    <b>Joseph Godwin<b>
    <br>
    <b>People's Advocate</b>`;
};

export const GMAIL = "gmail";
