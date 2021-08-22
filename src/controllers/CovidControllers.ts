import { Request, Response } from 'express';
import puppeteer from 'puppeteer';

function handleUpdateAt(date_utc: Date, offset: number = -3) {

  const milisegundos_com_utc = date_utc.getTime() + (date_utc.getTimezoneOffset() * 60000);
  const date = new Date(milisegundos_com_utc + (3600000 * offset));

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const withZero = (minutes: number) => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return numbers.includes(minutes) ? `0${minutes}` : minutes
  }

  return `${day} de ${months[month]} de ${year} às ${hours}:${withZero(minutes)}`;
} 

export default {
  async index(request: Request, response: Response) {
    try {
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox'] 
      });
      const page = await browser.newPage();
      await page.goto('https://www.jardim.ce.gov.br/', {
        waitUntil: 'load',
        timeout: 0
      });

      const pageContent = await page.evaluate(() => {
        const reportContext = document.querySelectorAll('.col-md-4.col-xs-4');
        const vaccinationContext = document.querySelectorAll('.vacina_quantidade');

        return {
          report: {
            confirmed: reportContext[0].innerHTML,
            discarded: reportContext[1].innerHTML,
            deaths: reportContext[2].innerHTML,
            admitted: reportContext[3].innerHTML,
            cured: reportContext[4].innerHTML,
            isolation: reportContext[5].innerHTML
          },
          vaccination: {
            received: vaccinationContext[0].innerHTML,
            applied: vaccinationContext[1].innerHTML
          }
        }
      });
  
      await browser.close();
  
      response.status(200).send({
        report: pageContent.report,
        vaccination: pageContent.vaccination,
        updatedOn: handleUpdateAt(new Date())
      }); 
    } catch (error) {
      console.log(error);
    }
  }
}