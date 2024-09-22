import 'dart:io';
import 'dart:convert';
import 'install.dart'; 
import 'URL_FILE.dart';

class Router {
  late final List<String> _arguments;

  Router();

  void parseArguments(List<String> arguments) {
    _arguments = arguments;

    if (_arguments.isEmpty) {
      print('No arguments provided');
    } else if (_arguments.length > 1) {
      print('Too many arguments provided');
    } else {
      _parseArguments();
    }
  }

  void _parseArguments() {
    if (_arguments.isEmpty) {
      print('Error: No arguments provided.');
      exit(1);
    }

    switch (_arguments[0]) {
      case 'install':
        _installDependencies();
        break;

      case 'test':
        _runTestSuite();
        break;

      default:
        print('Error: Invalid argument.');
        exit(1);
    }
  }

  void _installDependencies() async {
    print('Installing dependencies...');
    try {
      await installDependencies();
      print('Dependencies installation complete.');
    } catch (e) {
      print('Failed to install dependencies: $e');
      exit(1);
    }
  }

  void _runTestSuite() async {
    try {
      final result = await Process.run('npm', ['run', 'test'], runInShell: true);

      try {
        final file = File('test-results.json');
        if (!await file.exists()) {
          throw FileSystemException('test-results.json not found');
        }
        final jsonString = await file.readAsString();
        final jestOutput = jsonDecode(jsonString) as Map<String, dynamic>;
        _printTestResults(jestOutput);
      } catch (e) {
        print('Failed to read or parse test results: $e');
      }

      // Exit with the same code as the test suite
      exit(result.exitCode);
    } catch (e) {
      print('Failed to execute test suite: $e');
      exit(1);
    }
  }

  void _printTestResults(Map<String, dynamic> jestOutput) {
    int numTotalTests = jestOutput['numTotalTests'] as int? ?? 0;
    int numPassedTests = jestOutput['numPassedTests'] as int? ?? 0;

    final coverageMap = jestOutput['coverageMap'] as Map<String, dynamic>? ?? {};
    int totalStatements = 0;
    int coveredStatements = 0;

    coverageMap.forEach((file, data) {
      final statements = (data as Map<String, dynamic>)['s'] as Map<String, dynamic>? ?? {};
      totalStatements += statements.length;
      coveredStatements += statements.values.where((value) => (value as int) > 0).length;
    });

    final int coveragePercentage = (totalStatements > 0)
        ? ((coveredStatements / totalStatements) * 100).round()
        : 0;

    print('$numPassedTests/$numTotalTests test cases passed. $coveragePercentage% line coverage achieved.');
  }
}