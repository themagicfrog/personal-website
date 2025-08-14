export interface Photo {
  id: string;
  title: string;
  image: string;
  collection: string;
  date: string;
}

export interface PhotoCollection {
  name: string;
  photos: Photo[];
}
