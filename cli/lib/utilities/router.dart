import 'dart:io';
import 'install.dart';
import 'URL_FILE.dart';

/// [Router] class parses the arguments and routes to the appropriate
/// class based on the arguments provided.
class Router {
  late final List<String> _arguments;

  /// [Router] constructor
  Router(arguments) {
    // Check if Node.js is installed
    _checkNodeInstallation();

    // Set the arguments to the private variable
    _arguments = arguments;

    // Check if the arguments are empty or more than one
    if (_arguments.isEmpty) {
      print('No arguments provided');
    } else if (_arguments.length > 1) {
      print('Too many arguments provided');
    } else {
      // Parse the arguments for the appropriate class
      _parseArguments();
    }
  }

  void _checkNodeInstallation() async {
    try {
      final result = await Process.run('node', ['-v']);
      if (result.exitCode == 0) {
        print('Node.js is installed: ${result.stdout}');
      } else {
        print('Node.js is not installed.');
      }
    } catch (e) {
      print('Failed to check Node.js installation: $e');
    }
  }

  void _parseArguments() {
    if (_arguments.isEmpty) {
      print('Error: No arguments provided.');
      exit(1); // Exit with failure
    }

    switch (_arguments[0]) {
      case 'install':
        print('Installing dependencies...');
        installDependencies().then((_) {
          print('Dependencies installation complete.');
        }).catchError((e) {
          print('Failed to install dependencies: $e');
          exit(1); // Exit with failure
        });
        break;

      case 'test':
        print('Running test suite...');
        _runTestSuite();
        break;

      default:
        // Ensure that exactly one argument (URL_FILE) is provided
        if (_arguments.length != 1) {
          print(
              'Error: Exactly one argument (URL_FILE) is required for default case.');
          exit(1); // Exit with failure
        }

        String urlFile = _arguments[0];

        try {
          File file = File(urlFile);

          // Check if the file exists
          if (!file.existsSync()) {
            print('Error: File at "$urlFile" does not exist.');
            exit(1); // Exit with failure
          }

          // File exists, proceed with reading
          processUrlsFromFile(urlFile, 'output.NDJSON');
          print('Successfully read URLs from "$urlFile".');
        } catch (e) {
          print('Error reading file at "$urlFile": $e');
          exit(1); // Exit with failure
        }

        break;
    }
  }

  void _runTestSuite() async {
    print('Running test suite...');

    try {
      // Run the npm test command
      final result = await Process.run('npm', ['run', 'test'], runInShell: true);

      // Print the output and error exactly as Jest outputs it
      if (result.stdout.isNotEmpty) {
        stdout.write(result.stdout); // Direct output to stdout
      }
      if (result.stderr.isNotEmpty) {
        stderr.write(result.stderr); // Direct errors to stderr
      }

      // Check if the test suite executed successfully
      if (result.exitCode == 0) {
        print('Test suite executed successfully.');
      } else {
        print('Test suite failed with exit code: ${result.exitCode}');
      }
    } catch (e) {
      print('Failed to execute test suite: $e');
    }
  }
}

