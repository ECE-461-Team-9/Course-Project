import 'dart:io';

/// Function to process all URLs in a file and save the results as NDJSON
void processUrlsFromFile(String urlFile, String outputFile) async {
  try {
    // Check if the URL file exists
    if (!File(urlFile).existsSync()) {
      print("Error: File at '$urlFile' does not exist.");
      exit(1);
    }

    // Execute the TypeScript file using ts-node
    final result = await Process.run('ts-node', [
      'cli/lib/models/UrlProcessor.ts', // Replace with the correct path to your TypeScript file
      urlFile,
      outputFile
    ]);

    // Check if the TypeScript execution was successful
    if (result.exitCode == 0) {
      print("Results successfully saved to $outputFile");
      exit(0); // Exit with success
    } else {
      print("Error processing URLs: ${result.stderr}");
      exit(1); // Exit with failure
    }
  } catch (e) {
    print("Error reading file $urlFile: $e");
    exit(1); // Exit with failure
  }
}
