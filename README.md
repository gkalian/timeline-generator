# Timeline generator

A simple timeline chart generator built using the **Apex Chart** and **Vuepic/vue-datepicker** libraries. Supports multiple rows, changing the chart title, and resizing the entire chart.

<details>
<summary>Demo</summary>
<br>
  
  ![Demo](public\demo.gif)
  
</details>

**Plans to do**:

- Extract the VueDatePicker code to a separate component
- Improve the VueDatePicker style and update the overall app style
- Save input date in browser kv store
- Add possibility to import data from .csv file


### Build 

![ME](https://img.shields.io/badge/by-gkalian-purple?style=for-the-badge&&logoColor=white)
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Vuetify](https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=AEDDFF)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## Usage

- Install dependencies `npm install`
- Run locally `npm run dev`

## Changelog

v1.3
  - updated package.json
  - extracted some functions (working with local storage and upload data) into separate js file
  - update all libs and dependencies

v1.2
  - **feature**: possibility to upload .csv with data

v1.1
  - correct date formatting
  - update chart style

v1.0
  - initial release


## License

[MIT](http://opensource.org/licenses/MIT)