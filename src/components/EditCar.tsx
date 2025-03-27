import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Car } from "../types";

type EditCarProps = {
  open: boolean;
  car: Car | null;
  onClose: () => void;
  onSave: () => void;
};

export default function EditCar({ open, car, onClose, onSave }: EditCarProps) {
  const [editedCar, setEditedCar] = useState<Car>({} as Car);

  useEffect(() => {
    if (car) {
      setEditedCar(car);
    }
  }, [car]);

  const handleChange = (field: keyof Car, value: string | number) => {
    setEditedCar((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!car?._links?.car?.href) {
      console.error("Missing car link for update");
      return;
    }

    fetch(car._links.car.href, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedCar),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update car");
        return res.json();
      })
      .then(() => {
        onSave();
      })
      .catch((err) => console.error(err));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Car</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Brand"
          fullWidth
          value={editedCar.brand || ""}
          onChange={(e) => handleChange("brand", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Model"
          fullWidth
          value={editedCar.model || ""}
          onChange={(e) => handleChange("model", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Color"
          fullWidth
          value={editedCar.color || ""}
          onChange={(e) => handleChange("color", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Fuel"
          fullWidth
          value={editedCar.fuel || ""}
          onChange={(e) => handleChange("fuel", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Model Year"
          type="number"
          fullWidth
          value={editedCar.modelYear || ""}
          onChange={(e) => handleChange("modelYear", Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Price (€)"
          type="number"
          fullWidth
          value={editedCar.price || ""}
          onChange={(e) => handleChange("price", Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
