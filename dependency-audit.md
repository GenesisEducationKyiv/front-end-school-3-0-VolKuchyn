# A dependency audit 

A dependency audit firstly was performed using the **npm audit** command.
The report showed the following 4 vulnerabilities:

|      Package     |                 Vulnerability                 | Danger level |     Action    |
|:----------------:|:---------------------------------------------:|:------------:|:-------------:|
| brace-expansion  | RegExp Denial of Service (ReDoS)              | Low          | npm audit fix |
| react-router     | Data spoofing + DoS via caching               | High         | npm audit fix |
| react-router-dom | Vulnerable because it depends on react-router | High         |               |
| vite             | The file path could be bypassed               | Medium       | npm audit fix |

They were all then fixed with the **npm audit fix** command.
A subsequent npm audit command found 0 vulnerabilities.

### Package analysis with **socket.dev** 
Also showed **zero** vulnerabilities, and also checked and noted that there were **no zero-day vulnerabilities**.

### A licence audit 
Was also conducted using the licence-checker tool (via npx). **All third-party dependencies have secure open licences**. The only UNLICENSED package is our own project genesis-test@0.0.0.

## Package replacement
I suggest replacing the **glob** package with **fast-glob**, as glob@7.2.3 is **outdated** and has a low level of support. I checked its security level with a socket scan and analysis of repository activity on GitHub - no critical vulnerabilities were found, but the project is rarely updated. fast-glob is a modern alternative with a compatible API, better performance, and higher support and security, so I recommend using it.