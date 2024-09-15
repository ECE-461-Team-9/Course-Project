const isTypeScriptInstalled = (): boolean => {
    try {
        require.resolve('typescript');
        return true;
    } catch (error) {
        return false;
    }
};

console.log('TypeScript is installed:', isTypeScriptInstalled());