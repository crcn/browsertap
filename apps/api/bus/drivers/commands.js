export default function(commands, bus) {
  return function*(operation) {
    return yield (commands[operation.name] || bus)(operation);
  };
}