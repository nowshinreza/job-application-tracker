export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex h-14 items-center justify-center px-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Job Tracker • Built by{" "}
          <span className="font-medium text-foreground">Nowshin Reza</span>
        </p>
      </div>
    </footer>
  );
}