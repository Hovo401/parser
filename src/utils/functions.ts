import {URL} from 'url';

function getDomainName(urlString: string): string {
  const parsedUrl = new URL(urlString);
  return parsedUrl.hostname;
}

export { getDomainName };
