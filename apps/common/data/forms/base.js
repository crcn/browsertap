
class Form {
  async submit() {
    return (await this.bus.execute({
      action: this.name,
      data: this
    }).read()).value;
  }
}

export default Form;
