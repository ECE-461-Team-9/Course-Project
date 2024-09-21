import 'dart:io';

import 'install.dart';
import 'URL_FILE.dart';

///
/// [Router] class parses the arguments and routes to the appropriate
/// class based on the arguments provided.
///
class Router {
  late final List<String> _arguments;

  /// [Router] constructor
  Router(arguments) {
    // check if Node.js is installed
    _checkNodeInstallation();

    // set the argumets to the private variable
    _arguments = arguments;

    // check if the arguments are empty or more than one
    if (_arguments.isEmpty) {
      print('No arguments provided');
    } else if (_arguments.length > 1) {
      print('Too many arguments provided');
    } else {
      // parse the arguments for the appropriate class
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
        // Add your test suite execution logic here
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
}
