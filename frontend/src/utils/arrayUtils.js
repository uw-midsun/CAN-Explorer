export const flattenCanMessageObject = (messages) => {
  let flattenedMessages = [];
  let n = 0;
  for (const key of Object.keys(messages)) {
    flattenedMessages.push({"frameID": key});
    for (const [attr, value] of Object.entries(messages[key])) {
        n = flattenedMessages.length;
        flattenedMessages[n - 1][attr] = value;
    }
  }
  return flattenedMessages;
};
