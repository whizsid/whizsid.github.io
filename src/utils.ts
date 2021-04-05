export const titleToLink = (title: string): string => {
    return title.split(" ").join("-").toLowerCase()
}
