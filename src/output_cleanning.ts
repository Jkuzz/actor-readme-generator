export const cleanOutput = (output: string) => {
    // Only remove content after the last "---" if it appears within the last 10 lines
    return output.replace(/(?<=[\s\S]*?)---[\s\S]*?$/m, (match) => {
        const lines = output.split('\n');
        const matchStartLine = lines.length - match.split('\n').length;

        // Only apply the replacement if "---" is within last 10 lines
        if (lines.length - matchStartLine <= 10) {
            return '';
        }
        return match;
    });
};
