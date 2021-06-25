export interface User {
  _id?: string
  createdAt?: string
  updatedAt?: string
  firstName: string
  lastName: string
  profilePic: string | File
  githubURL: string
  portfolioURL: string
  capstoneURL: string
  linkedinURL: string
  youtubeURL?: string
  availableToRelocation: boolean
  located: string
  desiredPosition: string
  approved: boolean
  oneLiner?: string
  role?: string
}
