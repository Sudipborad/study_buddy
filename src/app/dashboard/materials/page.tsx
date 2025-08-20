import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockMaterials = [
    { id: '1', title: 'Quantum Physics Basics', type: 'Flashcards', createdAt: '2024-05-20' },
    { id: '2', title: 'History of Ancient Rome', type: 'Flashcards', createdAt: '2024-05-18' },
    { id: '3', title: 'Cellular Biology Notes', type: 'Flashcards', createdAt: '2024-05-15' },
    { id: '4', title: 'Introduction to JavaScript', type: 'Flashcards', createdAt: '2024-05-12' },
]

export default function MaterialsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Materials</h1>
                <p className="text-muted-foreground">
                    All your generated study sets in one place.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Study Sets</CardTitle>
                    <CardDescription>
                        Manage and review your previously generated materials.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden sm:table-cell">Type</TableHead>
                                <TableHead className="hidden md:table-cell">Created At</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockMaterials.map((material) => (
                                <TableRow key={material.id}>
                                    <TableCell className="font-medium">{material.title}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant="outline">{material.type}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{material.createdAt}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
