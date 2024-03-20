import requests
import csv

with open('leeassociates_pdf.csv', mode='r') as file:
    reader = csv.reader(file)
    for row in reader:
        url = row[0]

        fileName = url.split("?")[0].split("/")[5] + ".pdf"
        print("file name : ", fileName)
        response = requests.get(url)

        if response.status_code == 200:
            with open(fileName, 'wb') as file:
                file.write(response.content)
            print('Download completed successfully.')
        else:
            print('Failed to download the file. Status code:', response.status_code)
