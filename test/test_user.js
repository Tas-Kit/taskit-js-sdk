const { Userservice: Userservice } = require('../index')

const axios = require('axios').create({
  baseURL: 'http://sandbox.tas-kit.com/api/v1/userservice/',
})

axios.defaults.headers.common['Cookie'] = `JWT=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiMDA0NWY2YTAtZmIxOS00MGEwLTg2NTAtMWJmMzM4MTFjMTI3IiwidXNlcm5hbWUiOiJyb290IiwiZXhwIjoxNTQwNzY1MDI0LCJlbWFpbCI6InpoZW55YW5nemhvbmcxOTk1QGdtYWlsLmNvbSIsIm9yaWdfaWF0IjoxNTQwNjc4NjI0fQ.aRfcDvXzi7r-snaCoTDNYJtROM_oVp0xpKsxG_8oFxp7MNMsqjlYTJy0cQZjPJl0qCV9wenkyJmKtnx3BYTEldMfL2NXqnUo981Jf6FlB1rfBQ2Ko0GXr-I5GcggC7NG9GQfo3FpWk1tDAskDB4G-PG1I4BOjZ3l2lcVLJruEp3GEQ6kF3jCevEUxzhHrOSPDFsgND4frOhNtgmp9upCQM9VtnWbB0IE400PEisiKmkFOWiu-e55hx8qSogaQMjkGqNpMPdVQdm3uk2EwgoO18Oh89-xvZnUu5Xg34Ge0CKQdP6XvS5hgOApSdm95ItlqxLhraO5Jpkoj116kD77ZUuJE9dy1vDF8x9GCUNKQsGYPdk_qPCcRFKAI7rTxY400Mwfro1SNiojBpZaoU2X_5ioK9zSiHH_Me6Ive-Wh5abmYfwqNkJ8xhf5_-gkw4Cd9oZ78slfgusd2NLeUF3uPOTOZj--WsHnPdwpIQLvcAAGG5spuOYglweeHnwOcJyCwd7LCbVJ1xp_GTodsaQGLjOFO1cu3H0ESKnSQCHGuHcwS1UkbUQiM9xn6-bSUBeviUIzeEbob66nBNmKbApEjKH3HTkEeDOXM4qVQu2UVZTmO7ngBsvXV5Z4ydzt2BOLSQJqT-WDgVIRZaSd1EDQ_MiwDMn1Ljr5jhbTl59mZI`

Userservice.getCurrentUser()
