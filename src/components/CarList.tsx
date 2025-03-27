import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  themeMaterial,
  ICellRendererParams,
} from "ag-grid-community";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AddCar from "./AddCar";
import { Car } from "../types";
import EditCar from "./EditCar";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const [columnDefs] = useState<ColDef<Car>[]>([
    { field: "brand", filter: true, width: 100 },
    { field: "model", filter: true, width: 150 },
    { field: "color", filter: true, width: 150 },
    { field: "fuel", filter: true, width: 120 },
    { field: "modelYear", filter: true, width: 120 },
    { field: "price", filter: true, width: 150 },
    {
      width: 200,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            size="small"
            color="primary"
            onClick={() => handleEdit(params)}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    fetch(import.meta.env.VITE_API_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Error when fetching cars");

        return response.json();
      })
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  };
  const handleEdit = (params: ICellRendererParams) => {
    const carToEdit = params.data as Car;
    setSelectedCar(carToEdit);
    setEditDialogOpen(true);
  };

  const handleDelete = (params: ICellRendererParams) => {
    if (window.confirm("Are you sure?")) {
      fetch(params.data._links.car.href, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error when deleting car");

          return response.json();
        })
        .then(() => fetchCars())
        .then(() => setOpen(true))
        .catch((err) => console.error(err));
    }
  };

  return (
    <>
      <AddCar fetchCars={fetchCars} />
      <div style={{ width: "90%", height: 500 }}>
        <AgGridReact
          rowData={cars}
          columnDefs={columnDefs}
          pagination={true}
          paginationAutoPageSize={true}
          theme={themeMaterial}
        />
      </div>
      <EditCar
        open={editDialogOpen}
        car={selectedCar}
        onClose={() => setEditDialogOpen(false)}
        onSave={() => {
          setEditDialogOpen(false);
          fetchCars();
        }}
      />
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Car deleted succesfully"
      />
    </>
  );
}
