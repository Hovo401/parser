import {URL} from 'url';

function getDomainName(urlString: string): string {
  const parsedUrl = new URL(urlString);
  return parsedUrl.hostname;
}

type ParsingData = {
  [key: string]: { [key: string]: string | string[] }[]
};




export { getDomainName };
