export default function(commands, bus) {
  return function(operation) {
    return (commands[operation.name] || bus)(operation);
  };
}
