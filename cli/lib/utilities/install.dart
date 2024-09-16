import 'dart:io';

/// Default TypeScript libraries and their versions.
final Map<String, String?> defaultDependencies = {
  'typescript': null,   // TypeScript compiler
  'ts-node': null,      // Run TypeScript files directly
  '@types/node': '18.7.0',   // Node.js type definitions
  'axios' : null,
  'isomorphic-git' : null,
  'fs' : null
};

/// Installs the specified npm dependencies, using default values if none provided.
Future<void> installDependencies([Map<String, String?>? dependencies]) async {
  // Use defaultDependencies if no custom dependencies are provided
  final effectiveDependencies = dependencies ?? defaultDependencies;

  // Construct the npm install command arguments
  var args = ['install', '--save-dev'];
  
  effectiveDependencies.forEach((pkg, version) {
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
