export type MediaType = 'image' | 'video';

export class ProductMedia {
  id: number = 0;
  url: string = '';
  mediaType: MediaType = 'image';
  order: number = 0;

  constructor(id: number = 0, url: string = '', mediaType: MediaType = 'image', order: number = 0) {
    this.id = id;
    this.url = url;
    this.mediaType = mediaType;
    this.order = order;
  }
}