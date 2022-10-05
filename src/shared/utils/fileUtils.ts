export const filetypeIsAudio = (type: string) => ["audio/mp3", "audio/mp4", "audio/mpeg"].some(x => x === type)
export const filetypeIsVideo = (type: string) => ["video/mp4", "video/mov", "video/quicktime"].some(x => x === type)
export const filetypeIsImage = (type: string) => ["image/jpg", "image/jpeg", "image/gif", "image/png"].some(x => x === type)
export const filetypeIsAllowed = (type: string, category?: string) => {
  switch (category) {
    case 'video':
      return filetypeIsVideo(type);
    case 'audio':
      return filetypeIsAudio(type);
    default:
      return filetypeIsImage(type);
  }
}

export const fileToSrc = (file?: File) => !!file ? URL.createObjectURL(file) : ""

export const cleanString = (str: string, strong?: boolean): string => {
    const regex = !!strong
        ? /^[\s]|[^a-zA-Z0-9_-\sÀ-ú]/g
        : /^[\s]|[^a-zA-Z0-9_-\s"'À-ú()\.]/g

    return str.replace(regex, '');
}
