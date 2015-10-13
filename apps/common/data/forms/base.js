
class Form {
  async submit() {
    return (await this.bus.execute({
      name: this.name,
      data: this
    }).read()).value;
  }
}

export default Form;
