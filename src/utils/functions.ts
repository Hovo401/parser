import {URL} from 'url';

function getDomainName(urlString: string): string {
  try {
    const parsedUrl = new URL(urlString);
    return parsedUrl?.hostname || '';
  } catch (error) {
    return ''
  }

}

export { getDomainName };
