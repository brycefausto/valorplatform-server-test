export const APP_NAME = process.env.APP_NAME || "Next Commerce"

export const IMAGE_KIT_PUBLIC_KEY = process.env.IMAGE_KIT_PUBLIC_KEY || ''
export const IMAGE_KIT_PRIVATE_KEY = process.env.PRIVATE_KEY || ''
export const IMAGE_KIT_URL = process.env.IMAGE_KIT_URL || ''
export const IMAGE_KIT_FOLDER = process.env.IMAGE_KIT_FOLDER || ''
export const BASE_IMAGE_URL = process.env.IMAGE_KIT_URL + IMAGE_KIT_FOLDER || ''
export const BASE_USERS_IMAGE_FOLDER = IMAGE_KIT_FOLDER + "/users/"
export const BASE_ITEMS_IMAGE_FOLDER = IMAGE_KIT_FOLDER + "/items/"
export const BASE_COMPANIES_IMAGE_FOLDER = IMAGE_KIT_FOLDER + "/companies/"
export const BASE_USERS_IMAGE_URL = BASE_IMAGE_URL + "/users/"
export const BASE_ITEMS_IMAGE_URL = BASE_IMAGE_URL + "/items/"
export const BASE_COMPANIES_IMAGE_URL = BASE_IMAGE_URL + "/companies/"