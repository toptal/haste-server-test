import { siteCopy } from './site-copy'

import { CodeType, Language, LanguageTitles } from '~/lib/types/language'

export const LANGUAGES: Language[] = [
  {
    title: LanguageTitles.Api,
    route: '/documentation'
  },
  {
    title: LanguageTitles.Wget,
    route: '/documentation/wget',
    slug: 'wget',
    codes: [
      {
        code: `wget -q --post-data='${siteCopy.api.endpoints.documents.input}' -O - ${siteCopy.api.endpoints.documents.url}`,
        title: 'wget',
        type: CodeType.StringOutput,
        output: siteCopy.api.endpoints.documents.output,
        endpointName: siteCopy.api.endpoints.documents.name
      },
      {
        code: `wget ${siteCopy.api.endpoints.raw.url}/${siteCopy.api.endpoints.raw.input}`,
        title: 'wget',
        type: CodeType.StringOutput,
        output: siteCopy.api.endpoints.raw.output,
        endpointName: siteCopy.api.endpoints.raw.name
      }
    ]
  },
  {
    title: LanguageTitles.Curl,
    route: '/documentation/curl',
    slug: 'curl',
    free: true,
    codes: [
      {
        code: `curl -X POST -s --data-urlencode 'input=${siteCopy.api.endpoints.documents.input}' ${siteCopy.api.endpoints.documents.url}`,
        title: 'Curl',
        type: CodeType.StringOutput,
        output: siteCopy.api.endpoints.documents.output,
        endpointName: siteCopy.api.endpoints.documents.name
      },
      {
        code: `curl ${siteCopy.api.endpoints.raw.url}/${siteCopy.api.endpoints.raw.input}`,
        title: 'Curl',
        type: CodeType.StringOutput,
        output: siteCopy.api.endpoints.raw.output,
        endpointName: siteCopy.api.endpoints.raw.name
      }
    ]
  },
  {
    title: LanguageTitles.Nodejs,
    route: '/documentation/nodejs',
    slug: 'nodejs',
    codes: [
      {
        code: `const querystring = require('querystring');
const https  = require('https');

const query = querystring.stringify({
  input : '${siteCopy.api.endpoints.documents.input}',
});

const req = https.request(
  {
    method   : 'POST',
    hostname : '${siteCopy.api.endpoints.documents.hostname}',
    path     : '${siteCopy.api.endpoints.documents.path}',
  },
  function(resp) {
    // if the statusCode isn't what we expect, get out of here
    if ( resp.statusCode !== 200 ) {
      console.log('StatusCode=' + resp.statusCode);
      return;
    }

    resp.pipe(process.stdout);
  }
);
req.on('error', function(err) {
  throw err;
});
req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
req.setHeader('Content-Length', query.length);
req.end(query, 'utf8');`,
        title: 'Node.js',
        explanation: `Save the code to a file named <<hastebin.js>> and run the following command:`,
        output: siteCopy.api.endpoints.documents.output,
        command: 'node hastebin.js',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.documents.name
      },
      {
        code: `const https  = require('https');

https.get('${siteCopy.api.endpoints.raw.url}/${siteCopy.api.endpoints.raw.input}', (res) => {
  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});`,
        title: 'Node.js',
        explanation: `Save the code to a file named <<hastebin.js>> and run the following command:`,
        output: siteCopy.api.endpoints.raw.output,
        command: 'node hastebin.js',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.raw.name
      }
    ]
  },
  {
    title: LanguageTitles.Python,
    route: '/documentation/python',
    slug: 'python',
    codes: [
      {
        code: `import requests

response = requests.post('${siteCopy.api.endpoints.documents.url}', data=dict(input='${siteCopy.api.endpoints.documents.input}')).text

print("{}".format(response))`,
        explanation:
          'Install <<requests>> module, save the code to a file named <<hastebin.py>> and run the following command:',
        title: 'Python',
        output: siteCopy.api.endpoints.documents.output,
        command: 'python3 hastebin.py',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.documents.name
      },
      {
        code: `import requests

response = requests.get('${siteCopy.api.endpoints.raw.url}/${siteCopy.api.endpoints.raw.input}').text

print("{}".format(response))`,
        explanation:
          'Install <<requests>> module, save the code to a file named <<hastebin.py>> and run the following command:',
        title: 'Python',
        output: siteCopy.api.endpoints.raw.output,
        command: 'python3 hastebin.py',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.raw.name
      }
    ]
  },
  {
    title: LanguageTitles.Java,
    route: '/documentation/java',
    slug: 'java',
    free: true,
    codes: [
      {
        code: `import java.io.*;
import java.net.*;

class Hastebin {
  public static void main(String[] args) {
    try {
      final URL url = new URL("${siteCopy.api.endpoints.documents.url}");
      var input = "${siteCopy.api.endpoints.documents.input}";

      final StringBuilder data = new StringBuilder();
      data.append(URLEncoder.encode("input", "UTF-8"));
      data.append('=');
      data.append(URLEncoder.encode(input, "UTF-8"));

      var bytes = data.toString().getBytes("UTF-8");

      final HttpURLConnection conn = (HttpURLConnection) url.openConnection();

      conn.setRequestMethod("POST");
      conn.setDoOutput(true);
      conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
      conn.setRequestProperty("charset", "utf-8");
      conn.setRequestProperty("Content-Length", Integer.toString(bytes.length));

      try (DataOutputStream wr = new DataOutputStream(conn.getOutputStream())) {
        wr.write(bytes);
      }

      final int code = conn.getResponseCode();

      if (code == 200) {
        final BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String inputLine;

        while ((inputLine = in.readLine()) != null) {
          System.out.print(inputLine);
        }
        in.close();

      } else {
        System.out.println("Oops");
      }
    } catch (Exception e) {
      System.out.println("Oops");
    }
  }
}`,
        output: siteCopy.api.endpoints.documents.output,
        title: 'Java',
        explanation:
          'save the code to a file named <<hastebin.java>> and run the following command:',
        command: 'java hastebin.java',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.documents.name
      },
      {
        code: `import java.io.*;
import java.net.*;

class Hastebin {
  public static void main(String[] args) {
    try {
      final URL url = new URL("${siteCopy.api.endpoints.raw.url}/${siteCopy.api.endpoints.raw.input}");

      final HttpURLConnection conn = (HttpURLConnection) url.openConnection();

      final int code = conn.getResponseCode();

      if (code == 200) {
        final BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String inputLine;

        while ((inputLine = in.readLine()) != null) {
          System.out.print(inputLine);
        }
        in.close();

      } else {
        System.out.println("Oops");
      }
    } catch (Exception e) {
      System.out.println("Oops");
    }
  }
}`,
        output: siteCopy.api.endpoints.raw.output,
        title: 'Java',
        explanation:
          'save the code to a file named <<hastebin.java>> and run the following command:',
        command: 'java hastebin.java',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.raw.name
      }
    ]
  },
  {
    title: LanguageTitles.Ruby,
    route: '/documentation/ruby',
    slug: 'ruby',
    codes: [
      {
        code: `require "rest_client"

response = RestClient.post "${siteCopy.api.endpoints.documents.url}", {:input => "${siteCopy.api.endpoints.documents.input}"}
puts(response)`,
        title: 'Ruby',
        explanation:
          'Install the <<rest-client>> gem, save the code to a file named <<hastebin.rb>> and run the following command:',
        command: 'ruby hastebin.rb',
        output: siteCopy.api.endpoints.documents.output,
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.documents.name
      },
      {
        code: `require "rest_client"

response = RestClient.get "${siteCopy.api.endpoints.raw.url}/${siteCopy.api.endpoints.raw.input}"
puts(response)`,
        title: 'Ruby',
        explanation:
          'Install the <<rest-client>> gem, save the code to a file named <<hastebin.rb>> and run the following command:',
        command: 'ruby hastebin.rb',
        output: siteCopy.api.endpoints.raw.output,
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.raw.name
      }
    ]
  },
  {
    title: LanguageTitles.Perl,
    route: '/documentation/perl',
    slug: 'perl',
    free: true,
    codes: [
      {
        code: `use LWP::UserAgent;

my $ua = LWP::UserAgent->new( 'send_te' => '0' );
my $r  = HTTP::Request->new(
    'POST' => '${siteCopy.api.endpoints.documents.url}',
    [
        'Accept'         => '*/*',
        'User-Agent'     => 'curl/7.55.1',
        'Content-Type'   => 'application/x-www-form-urlencoded'
    ],
    "input=${siteCopy.api.endpoints.documents.input}"
);
my $result = $ua->request( $r, )->decoded_content();

print $result;`,
        title: 'Perl',
        output: siteCopy.api.endpoints.documents.output,
        explanation:
          'Save the code to a file named <<hastebin.pl>> and run the following command:',
        command: 'perl hastebin.pl',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.documents.name
      },
      {
        code: `use LWP::UserAgent;

my $ua = LWP::UserAgent->new( 'send_te' => '0' );
my $r  = HTTP::Request->new(
    'GET' => '${siteCopy.api.endpoints.raw.url}/${siteCopy.api.endpoints.raw.input}'
);
my $result = $ua->request( $r, )->decoded_content();

print $result;`,
        title: 'Perl',
        output: siteCopy.api.endpoints.raw.output,
        explanation:
          'Save the code to a file named <<hastebin.pl>> and run the following command:',
        command: 'perl hastebin.pl',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.raw.name
      }
    ]
  },
  {
    title: LanguageTitles.Php,
    route: '/documentation/php',
    slug: 'php',
    free: true,
    codes: [
      {
        code: `<?php
    $url = '${siteCopy.api.endpoints.documents.url}';

    // init the request, set various options, and send it
    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ["Content-Type: application/x-www-form-urlencoded"],
        CURLOPT_POSTFIELDS => http_build_query([ "input" => "${siteCopy.api.endpoints.documents.input}" ])
    ]);

    $result = curl_exec($ch);

    // finally, close the request
    curl_close($ch);

    // output the $result
    echo $result;
?>`,
        explanation: `Save the code to a file named <<hastebin.php>> and run the following command:`,
        command: 'php hastebin.php',
        output: siteCopy.api.endpoints.documents.output,
        title: 'PHP',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.documents.name
      },
      {
        code: `<?php
    $url = '${siteCopy.api.endpoints.raw.url}/${siteCopy.api.endpoints.raw.input}';

    // init the request, set various options, and send it
    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
    ]);

    $result = curl_exec($ch);

    // finally, close the request
    curl_close($ch);

    // output the $result
    echo $result;
?>`,
        explanation: `Save the code to a file named <<hastebin.php>> and run the following command:`,
        command: 'php hastebin.php',
        output: siteCopy.api.endpoints.raw.output,
        title: 'PHP',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.raw.name
      }
    ]
  },
  {
    title: LanguageTitles.CSharp,
    route: '/documentation/c-sharp',
    slug: 'c-sharp',
    codes: [
      {
        code: `using System;
using System.Net;
using System.Text;
using System.IO;
using System.Diagnostics;

public class Program
{
    public static void Main()
    {
        var content = "${siteCopy.api.endpoints.documents.input}";
        var request = (HttpWebRequest)WebRequest.Create("${siteCopy.api.endpoints.documents.url}");
        request.Method = "POST";
        string formContent = "input=" + content;
        byte[] byteArray = Encoding.UTF8.GetBytes(formContent);
        request.ContentType = "application/x-www-form-urlencoded";
        request.ContentLength = byteArray.Length;

        Stream str = request.GetRequestStream();
        str.Write(byteArray, 0, byteArray.Length);
        str.Close();

        WebResponse response = request.GetResponse();
        str = response.GetResponseStream();
        if (str != null)
        {
          StreamReader reader = new StreamReader(str);
          var result = reader.ReadToEnd();
          Console.WriteLine(result);
          reader.Close();
          str.Close();
        }
        response.Close();
    }
}`,
        explanation: `Copy this to your <<Program.cs>> file of your project and run the following command:`,
        output: siteCopy.api.endpoints.documents.output,
        command: 'dotnet run',
        title: 'C#',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.documents.name
      },
      {
        code: `using System;
using System.Net;
using System.Text;
using System.IO;
using System.Diagnostics;

public class Program
{
    public static void Main()
    {
        var request = (HttpWebRequest)WebRequest.Create("${siteCopy.api.endpoints.raw.url}/${siteCopy.api.endpoints.raw.input}");
        request.Method = "GET";

        Stream str = request.GetRequestStream();
        str.Write(byteArray, 0, byteArray.Length);
        str.Close();

        WebResponse response = request.GetResponse();
        str = response.GetResponseStream();
        if (str != null)
        {
          StreamReader reader = new StreamReader(str);
          var result = reader.ReadToEnd();
          Console.WriteLine(result);
          reader.Close();
          str.Close();
        }
        response.Close();
    }
}`,
        explanation: `Copy this to your <<Program.cs>> file of your project and run the following command:`,
        output: siteCopy.api.endpoints.raw.output,
        command: 'dotnet run',
        title: 'C#',
        type: CodeType.StringOutput,
        endpointName: siteCopy.api.endpoints.raw.name
      }
    ]
  },
  {
    title: LanguageTitles.Kotlin,
    route: '/documentation/kotlin',
    slug: 'kotlin',
    free: true,
    codes: [
      {
        code: `import java.io.File
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

fun main() {

    // Input File
    val input = "${siteCopy.api.endpoints.documents.input}";

    // Create Content
    val content = StringBuilder().apply {
        append(URLEncoder.encode("input", "UTF-8"))
        append("=")
        append(URLEncoder.encode(input, "UTF-8"))
    }.toString()

    // Create Request
    val request = (URL("${siteCopy.api.endpoints.documents.url}").openConnection() as HttpURLConnection).apply {
        requestMethod = "POST"
        doOutput = true
        setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
        setRequestProperty("charset", "utf-8")
        setRequestProperty("Content-Length", content.length.toString())
        OutputStreamWriter(outputStream).apply {
            write(content)
            flush()
        }
    }

    // Parse Response
    if(request.responseCode == 200) {

        // Print Result
        println(InputStreamReader(request.inputStream).readText())
    }

    // Handle Error
    else println("Error: \${request.responseCode} \${request.responseMessage}")

}`,
        title: 'Kotlin',
        explanation:
          'save the code to a file named <<hastebin.kts>> and run the following command:',
        command:
          'kotlinc -script hastebin.kts -- -d <path_to_folder_to_inspect>',
        type: CodeType.StringOutput,
        output: siteCopy.api.endpoints.documents.output,
        endpointName: siteCopy.api.endpoints.documents.name
      },
      {
        code: `import java.io.File
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

fun main() {

    // Create Request
    val request = (URL("${siteCopy.api.endpoints.raw.url}/${siteCopy.api.endpoints.raw.input}").openConnection() as HttpURLConnection).apply {
        requestMethod = "GET"
        OutputStreamWriter(outputStream).apply {
            write(content)
            flush()
        }
    }

    // Parse Response
    if(request.responseCode == 200) {

        // Print Result
        println(InputStreamReader(request.inputStream).readText())
    }

    // Handle Error
    else println("Error: \${request.responseCode} \${request.responseMessage}")

}`,
        title: 'Kotlin',
        explanation:
          'save the code to a file named <<hastebin.kts>> and run the following command:',
        command:
          'kotlinc -script hastebin.kts -- -d <path_to_folder_to_inspect>',
        type: CodeType.StringOutput,
        output: siteCopy.api.endpoints.raw.output,
        endpointName: siteCopy.api.endpoints.raw.name
      }
    ]
  },
  {
    title: LanguageTitles.Rust,
    route: '/documentation/rust',
    slug: 'rust',
    free: true,
    codes: [
      {
        title: 'Rust',
        code: `use reqwest::blocking::Client;

fn main() {
    let client = reqwest::blocking::Client::new();
    let resp = client.post("${siteCopy.api.endpoints.documents.url}")
        .form(&[("input", "${siteCopy.api.endpoints.documents.input}")])
        .send().unwrap()
        .text().unwrap();
    println!("response = {:?}", resp);
}`,
        explanation:
          'Install <<reqwest>> crate, save the code to a file named <<hastebin.rs>> and run the following command:',
        command: 'rustc hastebin.rs',
        type: CodeType.StringOutput,
        output: siteCopy.api.endpoints.documents.output,
        endpointName: siteCopy.api.endpoints.documents.name
      },
      {
        title: 'Rust',
        code: `use reqwest::blocking::Client;

fn main() {
    let client = reqwest::blocking::Client::new();
    let resp = client.post("${siteCopy.api.endpoints.raw.url}/${siteCopy.api.endpoints.raw.input}")
        .send().unwrap()
        .text().unwrap();
    println!("response = {:?}", resp);
}`,
        explanation:
          'Install <<reqwest>> crate, save the code to a file named <<hastebin.rs>> and run the following command:',
        command: 'rustc hastebin.rs',
        type: CodeType.StringOutput,
        output: siteCopy.api.endpoints.raw.output,
        endpointName: siteCopy.api.endpoints.raw.name
      }
    ]
  }
]

export const MENU_ITEMS = LANGUAGES.map(lang => ({
  title: lang.title,
  route: lang.route
}))
