type Environment_Type = {
    BACKEND_URL: string
}

const Environment: Environment_Type = {
    BACKEND_URL: (process.env.BACKEND_URL === undefined) ? "http://localhost:8000" : process.env.BACKEND_URL
}

export default Environment