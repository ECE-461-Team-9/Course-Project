import 'dart:io';

void main() async {
  // Define the pip install command with the requirements file and --user flag
  var command = 'pip';
  var arguments = ['install', '--user', '-r', 'requirements.txt'];

  try {
    // Run the pip install command
    final result = await Process.run(command, arguments);

    // Check if the command was successful
    if (result.exitCode == 0) {
      print('Successfully installed packages from requirements.txt.');
      print(result.stdout);
    } else {
      print('Error installing packages from requirements.txt.');
      print(result.stderr);
    }
  } catch (e) {
    print('Failed to execute pip: $e');
  }
}
