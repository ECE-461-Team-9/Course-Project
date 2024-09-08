import 'dart:io';

/// List of essential TypeScript libraries and their versions to install.
final Map<String, String?> dependencies = {
  'typescript': null,   // TypeScript compiler
  'ts-node': null,      // Run TypeScript files directly
  '@types/node': '18.7.0'   // Node.js type definitions (specify version if needed)
};

/// Installs the specified npm dependencies.
Future<void> installDependencies(Map<String, String?> dependencies) async {
  // Construct the npm install command arguments
  var args = ['install', '--save-dev'];
  
  dependencies.forEach((pkg, version) {
    args.add(version == null ? pkg : '$pkg@$version');
  });

  // Run the npm install command
  await Process.run('npm', args).then((result) {
    if (result.exitCode == 0) {
      print('TypeScript dependencies installed successfully.');
    } else {
      print('Error installing dependencies: ${result.stderr}');
    }
  });
}

void main() async {
  print('Installing essential TypeScript libraries...');
  await installDependencies(dependencies);
}
