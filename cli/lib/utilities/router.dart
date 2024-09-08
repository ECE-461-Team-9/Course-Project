import 'install.dart';

///
/// [Router] class parses the arguments and routes to the appropriate
/// class based on the arguments provided.
///
class Router {
  late final List<String> _arguments;

  /// [Router] constructor
  Router(arguments) {
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

  void _parseArguments() {
    switch (_arguments[0]) {
      case 'install':
        print('Installing dependencies...');
        installDependencies().then((_) {
          print('Dependencies installation complete.');
        }).catchError((e) {
          print('Failed to install dependencies: $e');
        });
        break;
      case 'test':
        print('test command');
        break;
      default:
        print('file url');
    }
  }
}
