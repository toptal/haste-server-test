expect.extend({
  toMatchSchema(received, schema) {
    const error = schema.validate(received).error
    const pass = error === undefined

    if (pass) {
      return {
        pass: true
      }
    } else {
      return {
        message: () => error,
        pass: false
      }
    }
  }
})
