export class Func {
  constructor(
    public dsl: Dsl,
    public name: string,
    public returnType: string
  ) {}

  call(...args: Variable[]) {
    dsl.addLine(`${this.getCallString(...args)};`);
  }

  getCallString(...args: Variable[]) {
    const argsStr = args.map(arg => arg.name).join(', ');
    return `${this.name}(${argsStr})`;
  }
}

export class Variable {
  constructor(public dsl: Dsl, public name: string, public type: string) {}

  sub(value: string) {
    this.dsl.addLine(`${this.name} = ${value};`);
  }
}

export class Dsl {
  indent = 0;
  code = '';

  addLine(line: string) {
    this.code += '  '.repeat(this.indent) + line + '\n';
  }

  withIndent(callback: () => void) {
    this.indent++;
    callback();
    this.indent--;
  }

  function(
    name: string,
    props: [string, string][],
    returnType: string,
    callback: (...args: Variable[]) => void
  ) {
    const propsStr = props.map(([name, type]) => `${name}: ${type}`).join(', ');
    this.addLine(`function ${name}(${propsStr}): ${returnType} {`);

    this.withIndent(() => {
      const args = props.map(([name, type]) => new Variable(this, name, type));
      callback(...args);
    });

    this.addLine('}');

    return new Func(this, name, returnType);
  }

  return(returnValue?: string) {
    this.addLine(`return${returnValue == null ? '' : ` ${returnValue}`};`);
  }

  let(name: string, type: string, initialValue?: string | number) {
    const initialize =
      initialValue == null ? '' : ` = ${initialValue.toString()}`;
    this.addLine(`let ${name}: ${type}${initialize};`);
    return new Variable(this, name, type);
  }

  call(func: string, ...args: Variable[]) {
    const argsStr = args.map(arg => arg.name).join(', ');
    this.addLine(`${func}(${argsStr});`);
  }
}

export const dsl = new Dsl();
