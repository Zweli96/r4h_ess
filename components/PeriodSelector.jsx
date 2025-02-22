import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { getSession } from "next-auth/react";

function PeriodSelector({ setPeriod, value }) {
  const [options, setOptions] = useState([]);
  const handleChange = (event) => {
    setPeriod(event.target.value);
  };

  useEffect(() => {
    console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + "periods");
    // Define the async function to fetch data
    const fetchData = async () => {
      const session = await getSession();
      if (session) {
        try {
          const response = await axios({
            method: "get",
            url: process.env.NEXT_PUBLIC_BACKEND_URL + "timesheets/periods",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          setOptions(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 240 }}>
        <InputLabel id="period-select-helper-label">Period</InputLabel>
        <Select
          labelId="period-select-helper-label"
          id="period-select-helper"
          value={value}
          label="Period"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Please Select Period</FormHelperText>
      </FormControl>
    </div>
  );
}

export default PeriodSelector;
