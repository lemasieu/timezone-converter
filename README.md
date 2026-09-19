# Timezone Converter

A simple, interactive web tool that converts time and date between two selected timezones. Perfect for scheduling meetings, coordinating with remote teams, or planning travel across different regions.

## 🚀 Live Demo

Check out the live demo: [https://www.sieu.io.vn/github/timezone-converter](https://www.sieu.io.vn/github/timezone-converter)

## ✨ Features

- **Select Two Timezones** – Choose any two timezones from a comprehensive list
- **Convert Time & Date** – Instantly convert the current time and date between the selected timezones
- **Comprehensive Timezone List** – Supports a wide range of timezones worldwide, including major cities and UTC offsets
- **Clean Interface** – Simple, user-friendly design for quick and easy conversions
- **Responsive** – Works on desktop, tablet, and mobile devices

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- JSON (timezone data)

## 📁 Project Structure

```
timezone-converter/
├── index.html        # Main HTML file
├── style.css         # Stylesheet
├── script.js         # JavaScript functionality
├── timezone.json     # Timezone data
└── README.md         # Project documentation
```


## 🔧 Installation & Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/lemasieu/timezone-converter.git
   ```
2. **Navigate to the project folder**
   ```bash
   cd timezone-converter
   ```
3. **Run the application with a local server**

⚠️ Important: This project loads data from a JSON file, so you need to use a local development server instead of opening `index.html` directly in your browser to avoid CORS issues.

- **Using VS Code** – Install the "Live Server" extension, right-click on `index.html`, and select "Open with Live Server"
- **Using Python** – Run `python -m http.server` (Python 3) or `python -m SimpleHTTPServer` (Python 2) and open `http://localhost:8000`
- **Using Node.js** – Install `http-server` globally (`npm install -g http-server`) and run `http-server` in the project folder

## 📝 How It Works

1. **Select the first timezone** – Choose a timezone from the first dropdown menu
2. **Select the second timezone** – Choose a timezone from the second dropdown menu
3. **View the converted time** – The current time and date for both timezones are displayed instantly
4. **Switch timezones** – Easily change either selection to compare different regions

The timezone data is sourced from IBM's time zone list [https://www.ibm.com/docs/en/cloud-pak-system-w4600/2.3.4?topic=SSDLT6_2.3.4/psapsys_restapi/time_zone_list.htm](https://www.ibm.com/docs/en/cloud-pak-system-w4600/2.3.4?topic=SSDLT6_2.3.4/psapsys_restapi/time_zone_list.htm).

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request or open an Issue.
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is open-source and available under the MIT License.
