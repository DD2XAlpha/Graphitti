import tkinter as tk
from tkinter import filedialog

def open_file():
    root = tk.Tk()
    root.wm_attributes('-topmost', 1)
    root.withdraw()
    file_path = filedialog.askopenfilename()
    root.destroy()
    return file_path

def open_folder():
    root = tk.Tk()
    root.withdraw()
    folder_path = filedialog.askdirectory()
    root.destroy()
    return folder_path